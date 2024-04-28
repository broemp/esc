import { getMembersOfGroup, type MembersList } from '$lib/server/db/querys';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }: any) => {
  const members = getMembersOfGroup(params.id)
  return {
    slug: params.id,
    members: await members
  }
}
