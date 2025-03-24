
  
  export const Skills = ({ skills }: SkillsProps) => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
      </div>
    );
  };