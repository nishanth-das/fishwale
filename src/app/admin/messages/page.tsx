import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Contact Info</th>
                <th className="p-4 font-semibold text-gray-600">Message</th>
              </tr>
            </thead>
            <tbody>
              {messages?.map(msg => (
                <tr key={msg.id} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}<br/>
                    <span className="text-xs">{new Date(msg.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">{msg.name}</td>
                  <td className="p-4 text-gray-600 font-mono text-xs">{msg.contact_info}</td>
                  <td className="p-4 text-gray-700 whitespace-pre-wrap max-w-lg">{msg.message}</td>
                </tr>
              ))}
              {(!messages || messages.length === 0) && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No messages found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
