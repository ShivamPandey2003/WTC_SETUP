type prop = {
  id: string | null;
  onClose: () => void;
};

const TestMode = ({ id, onClose }: prop) => {
  if (!id) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-999">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
        <h3 className="text-lg font-semibold mb-2">Shape Options</h3>

        <p className="text-sm text-gray-600 mb-4">Shape ID: {id}</p>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-1 rounded bg-violet-600 text-white"
            onClick={() => {
              alert("Action applied");
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestMode;
