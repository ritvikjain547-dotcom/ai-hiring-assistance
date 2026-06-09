import { getUserWithProfile } from "@/actions/profile";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user = await getUserWithProfile();
  if (!user) redirect("/login");

  return (
    <ProfileForm
      profile={user.profile}
      userName={user.name}
      userEmail={user.email}
    />
  );
}
