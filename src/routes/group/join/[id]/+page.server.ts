import { getGroup, type GroupInfo } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }: any) => {
  const result = await getGroup(params.id);
  const group: GroupInfo = {
    id: result[0].group.id,
    name: result[0].group.name,
    public: result[0].group.public,
    members: [],
    categories: []
  };

  return {
    group: { group }
  };
};
