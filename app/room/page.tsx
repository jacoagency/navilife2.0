import { auth, currentUser } from '@clerk/nextjs'
import ChatComponent from "../../components/RoomInterface"

export default async function ChatPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    return <div>Please sign in to access the chat.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Chat</h1>
      <ChatComponent initialUser={{ id: userId, name: user.firstName ?? 'Anonymous' }} />
    </div>
  )
}