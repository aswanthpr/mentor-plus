import React,{useState} from 'react';
import { X } from 'lucide-react';

interface IFormData{
    name:string;
    phone:string;
    email:string;
    expertise:string;
    bio:string;
    avatar?:string;
    skills:string[]
}
interface IEditProfileModal{
    isOpen:boolean;
    onClose:()=>void;
    profile:IFormData
    onUpdate:(updateProfile:Partial<IFormData>)=>void;

}

const EditProfileModal:React.FC<IEditProfileModal> = ({
    isOpen,onClose,profile,onUpdate
}) => {
    const [formData,setFormData] = useState<IFormData>(profile);
    if(!isOpen) return null;
    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault()
        onUpdate(formData);
        onClose()
    }
  return (
    <div className='fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
        <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden'>
            <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
            </div>
    <form  onSubmit={handleSubmit}
    className='p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]'
    >
        <div >
        <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8800] focus:ring-[#ff8800]"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8800] focus:ring-[#ff8800]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8800] focus:ring-[#ff8800]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Expertise</label>
            <input
              type="text"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8800] focus:ring-[#ff8800]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8800] focus:ring-[#ff8800]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <input
              type="text"
              value='formData.skills.map(s => s.name).join(",")'
              onChange={(e) => {
                const skillNames = e.target.value.split(',').map(s => s.trim());
                const skills = skillNames.map((name, index) => ({
                  id: index.toString(),
                  name,
                }));
                // setFormData(' ...formData, skills ');
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8800] focus:ring-[#ff8800]"
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors"
            >
              Update
            </button>
          </div>
    </form>
        </div>

    </div>
  )
}

export default EditProfileModal