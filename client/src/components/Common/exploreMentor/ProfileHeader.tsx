import { MapPin, Star, Clock, Play, BookmarkPlus } from 'lucide-react';
import Button from '../../Auth/Button';

interface ProfileHeaderProps {
  image: string;
  name: string;
  position: string;
  description: string;
  location: string;
  rating: number;
  reviews: number;
  status: string;
  responseTime: string;
}

export const ProfileHeader = ({
  image,
  name,
  position,
  description,
  location,
  rating,
  reviews,
  status,
  responseTime,
}: ProfileHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{name}</h1>
            <p className="text-lg font-medium mb-1">{position}</p>
            <p className="text-white/90 mb-4">{description}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-300" />
                <span>{rating.toFixed(1)} ({reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>{status}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{responseTime}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button variant="dark" className="flex items-center gap-2">
                <Play size={16} />
                Play intro
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <BookmarkPlus size={16} />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};