import Image from "next/image";

export default function ProfileImage({ image }: { image: string | null }) {
  return (
    <div className="relative size-54 rounded-2xl overflow-hidden flex flex-col items-center justify-center">
      <Image src={image || ""} alt="profile-image" width={500} height={500} />
    </div>
  );
}
