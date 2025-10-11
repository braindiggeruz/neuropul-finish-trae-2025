.SILENT:

dev:
	./scripts/dev.sh

down:
	- supabase stop || true
	- pkill -f "supabase functions serve" || true

reset:
	- supabase db reset --force
	- supabase db push
	- supabase db execute --file supabase/seed/local_flags.sql
	- supabase db execute --file supabase/seed/local_min_data.sql

logs:
	- supabase logs --follow

test:
	npm run test && npx playwright test

lint:
	npm run lint && npm run typecheck