/** Local Deno ambient types so the IDE doesn't flag Edge Function files. */
declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }

  function serve(
    handler: (request: Request) => Response | Promise<Response>,
  ): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2.49.1" {
  // Minimal typing for Edge Function usage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function createClient(supabaseUrl: string, supabaseKey: string): any;
}
