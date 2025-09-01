import React from 'react';
import { 
  Home, 
  User, 
  Mail, 
  Phone, 
  Star, 
  Heart, 
  Search, 
  Settings, 
  Menu, 
  X, 
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const Icon = ({ 
  name = 'Home',
  size = 'medium',
  color = '#374151',
  className = '',
  style = {}
}) => {
  const icons = {
    Home, User, Mail, Phone, Star, Heart, Search, Settings, Menu, X,
    ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Plus, Minus,
    Check, AlertCircle, Info, Download, Upload, Edit, Trash2, Eye, EyeOff
  };

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  const IconComponent = icons[name] || Home;

  return (
    <IconComponent 
      className={`${sizeClasses[size]} transition-all duration-200 ${className}`}
      style={{ color, ...style }}
    />
  );
};

export default Icon;