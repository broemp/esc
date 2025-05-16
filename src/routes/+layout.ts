import '@fortawesome/fontawesome-free/css/all.min.css';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, url }) => {
  // Get the current path and set appropriate title
  const path = url.pathname;
  let title = 'Eurovision Votecontest';

  // Set specific titles for different routes
  if (path.startsWith('/admin')) {
    title = 'Admin - Eurovision Votecontest';
  } else if (path.startsWith('/group')) {
    title = 'Groups - Eurovision Votecontest';
  } else if (path.startsWith('/vote')) {
    title = 'Vote - Eurovision Votecontest';
  } else if (path.startsWith('/profile')) {
    title = 'Profile - Eurovision Votecontest';
  }

  return {
    ...data,
    title
  };
};
