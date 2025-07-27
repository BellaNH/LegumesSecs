import { Settings } from "lucide-react"; 

const SettingsIcon = ({ onClick }) => {
  return (
    <button onClick={onClick} className="p-2 hover:bg-gray-200 rounded-full">
      <Settings className="w-6 h-6 text-gray-600" />
    </button>
  );
};

export default SettingsIcon;
