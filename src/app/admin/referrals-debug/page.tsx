import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/lib/auth'

export default async function ReferralsDebugPage() {
  await requireAdmin();
  const supabase = await createClient();
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, email, referral_code')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Referral Codes Debug (Admin Only)</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Code</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {profiles?.map((profile) => (
            <tr key={profile.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.email || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-blue-600">
                {profile.referral_code || <span className="text-gray-400 italic">NULL (Missing)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
