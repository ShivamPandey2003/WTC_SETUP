interface LogoUploadProps {
  logoUrl?: string | null;
  fileName?: string;
}

export default function LogoUpload({
  logoUrl,
  fileName = "ita-montreal.png"
}: LogoUploadProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">App Logo</h3>
      <div className="bg-white p-4 rounded border border-gray-200 inline-block">
        <img
          src={logoUrl?logoUrl:'./Logo.png'}
          alt="App Logo"
          className="h-16 object-contain"
        />
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="text-gray-600">{fileName}</span>
        <button className="text-[#318061] hover:underline font-medium">Change</button>
        <button className="text-[#318061] hover:underline font-medium">Remove</button>
      </div>
    </div>
  );
}
