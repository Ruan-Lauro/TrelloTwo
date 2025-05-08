
type StatusOption = 'ativo' | 'inativo';

interface StatusSelectorProps {
  value: StatusOption;
  onChange: (value: StatusOption) => void;
}

const StatusSelector = ({ value, onChange }:StatusSelectorProps) => {
  return (
    <div>
      <label className="block text-1 font-semibold mb-2">Status</label>
      <div className="flex items-center gap-8">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="status"
            value="ativo"
            checked={value === 'ativo'}
            onChange={() => onChange('ativo')}
            className="accent-1"
          />
          <span>Ativo</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="status"
            value="inativo"
            checked={value === 'inativo'}
            onChange={() => onChange('inativo')}
            className="accent-1"
          />
          <span>Inativo</span>
        </label>
      </div>
    </div>
  );
};

export default StatusSelector;
