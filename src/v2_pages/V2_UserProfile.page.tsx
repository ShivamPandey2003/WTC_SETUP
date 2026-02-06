import ProfileForm from '@/components/common/Profile/ProfileForm'
import WTCBadge from '@/components/common/Profile/WTCBadge'

const V2_UserProfile_page = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <ProfileForm />
          <div className="w-fit flex flex-col items-center">
            <WTCBadge />
            <p></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default V2_UserProfile_page