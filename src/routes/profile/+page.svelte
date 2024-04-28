<script>
  import { page } from '$app/stores';
</script>

{$page.data.session?.user?.id} - {$page.data.session?.user?.role}
