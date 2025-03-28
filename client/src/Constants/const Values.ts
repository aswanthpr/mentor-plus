
import {
  Award,
  Code,
  Laptop,
  MessageSquare,
  Target,
  Users,
} from "lucide-react";

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
export const issues = [
  "health Issues",
  "personal Issue",
  "technical Issues",
  "family Obligation",
  "no Longer Interested",
  "found Another Mentor",
  "financial Constraints",
  "dissatisfaction with Platform or Service",
  "other",
];
export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const COLORS = ["#ff8800", "#ff9900", "#ffaa00", "#ffbb00", "#ffcc00"];

export const features = [
  {
    name: "Top Tech Mentors",
    description:
      "Learn from experienced engineers, developers, and tech leaders.",
    icon: Users,
  },
  {
    name: "Specialized Guidance",
    description:
      "Find mentors in software engineering, data science, DevOps, AI, and more.",
    icon: Code,
  },
  {
    name: "Project Reviews",
    description: "Get actionable feedback on your code and projects.",
    icon: Laptop,
  },
  {
    name: "Career Advancement",
    description:
      "Plan your tech career with mentors who have been in your shoes.",
    icon: Award,
  },
  {
    name: "Networking Opportunities",
    description: "Expand your connections in the tech community.",
    icon: MessageSquare,
  },
  {
    name: "Skill Mastery",
    description:
      "Stay updated with the latest tools, frameworks, and practices.",
    icon: Target,
  },
];
 export  const constraints = {
    video: {
      width: { ideal: 1920 }, // Full HD
      height: { ideal: 720 },
      frameRate: { ideal: 30, max: 60 }, // Smooth motion
      facingMode: "user",
      noiseSuppression: true, // Ensure front camera is used
    },
    audio: {
      echoCancellation: true, // Removes echo
      noiseSuppression: true, // Removes background noise
      autoGainControl: true, // Balances volume
      sampleRate: 48000, // Studio-quality audio
      sampleSize: 24, // Higher bit depth for clearer sound
      channelCount: 2, // Stereo audio
      latency: 0, // Reduce delay
    },
  };