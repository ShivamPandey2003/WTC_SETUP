
const CanvaShapeEditor = () => {
  return (
    <div className="absolute top-2/6 left-1 px-2">
      <div className="py-2 px-3 w-fit mx-auto border border-border shadow-lg rounded-lg bg-white">
        <div className="flex flex-col mb-6">
          <label htmlFor="color" className="text-xs mb-2 capitalize">
            Stroke
          </label>
          <div className="flex items-center gap-2">
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <input
              type="color"
              id="color"
              name="color"
              list="color-presets"
              value="#000000"
            />
          </div>
          <datalist id="color-presets">
            <option value="#000000"></option>
            <option value="#ffffff"></option>
            <option value="#ff0000"></option>
            <option value="#00ff00"></option>
            <option value="#0000ff"></option>
            <option value="#ffff00"></option>
            <option value="#ff00ff"></option>
            <option value="#00ffff"></option>
          </datalist>
        </div>
        <div className="flex flex-col mb-6">
          <label htmlFor="color" className="text-xs mb-2 capitalize">
            Background
          </label>
          <div className="flex items-center gap-2">
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <span className="bg-[#e74c3c] w-5 h-5 inline-block rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary"></span>
            <input
              type="color"
              id="color"
              name="color"
              list="color-presets"
              value="#000000"
            />
          </div>
          <datalist id="color-presets">
            <option value="#000000"></option>
            <option value="#ffffff"></option>
            <option value="#ff0000"></option>
            <option value="#00ff00"></option>
            <option value="#0000ff"></option>
            <option value="#ffff00"></option>
            <option value="#ff00ff"></option>
            <option value="#00ffff"></option>
          </datalist>
        </div>
        <div>
          <p className="text-xs mb-2 capitalize">stroke Width</p>
          <div className="flex items-center gap-2">
            <p
              onClick={() => {}}
              className=" cursor-pointer bg-white w-8 h-6 border border-border text-center rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary uppercase"
            >
              xs
            </p>
            <p className=" cursor-pointer bg-white w-8 h-6 border border-border text-center rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary uppercase">
              sm
            </p>
            <p className=" cursor-pointer bg-white w-8 h-6 border border-border text-center rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary uppercase">
              md
            </p>
            <p className=" cursor-pointer bg-white w-8 h-6 border border-border text-center rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary uppercase">
              lg
            </p>
            <p className=" cursor-pointer bg-white w-8 h-6 border border-border text-center rounded-sm hover:outline-1 hover:outline-offset-2 outline-primary uppercase">
              xl
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvaShapeEditor;
