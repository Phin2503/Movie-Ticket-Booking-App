import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDTO } from './dtos/create.dto';
import { UpdateMovieDto } from './dtos/update.dto';
import { PaginationDTO } from 'src/generic/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TypeTheater } from '../type-theater/typeTheater.entity';
import { Genre } from '../genre/genre.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    requestBody: CreateMovieDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const existingMovie = await this.movieRepository.findOneBy({
      title: requestBody.title,
    });

    if (existingMovie) {
      throw new BadRequestException('Name movie already exists !! try again !');
    }

    const existingGenre = await this.genreRepo.findOneBy({
      id: requestBody.genreId,
    });

    if (!existingGenre) {
      throw new NotFoundException('Not found type theater !! try again !');
    }

    try {
      const urlImg = await this.cloudinaryService.uploadImage(file);
      requestBody.background_image_url = urlImg.url;
    } catch (err) {
      console.log('Lỗi' + err);
    }

    const durationValue = Number(requestBody.duration);

    if (isNaN(durationValue)) {
      throw new BadRequestException('Duration must be a valid number');
    }

    requestBody.duration = durationValue;

    const newMovie = await this.movieRepository.create({
      ...requestBody,
      genre: existingGenre,
    });
    return await this.movieRepository.save(newMovie);
  }

  async update(requestBody: UpdateMovieDto, id: number) {
    const findMovie = await this.findMovie(id);

    const updateMovie: Movie = {
      ...requestBody,
      ...findMovie,
    };
    try {
      return await this.movieRepository.update(id, updateMovie);
    } catch (error) {
      throw new Error('Update failed, no records affected' + error.message);
    }
  }

  async delete(id: number) {
    this.findMovie(id);
    return this.movieRepository.delete(id);
  }

  async findMovie(id: number): Promise<Movie> {
    const findMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });
    if (!findMovie) {
      throw new NotFoundException({
        message: 'Not found the movie ! try again ...',
      });
    }
    return findMovie;
  }

  async findAll(pagination?: PaginationDTO) {
    return this.movieRepository.find({
      skip: pagination.skip || 1,
      take: pagination.limit ?? 100,
    });
  }
}
