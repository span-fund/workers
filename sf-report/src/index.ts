import { Workflows } from "./workflows/sentiment";

export { Workflows };

export default {

	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		url.pathname = '/__scheduled';
		url.searchParams.append('cron', '* * * * *');
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	},

	async scheduled(event, env, ctx): Promise<void> {

		const taskId = `sentiment-${Date.now()}`;

		const id = env.WORKFLOWS.idFromName(taskId);
		const stub = env.WORKFLOWS.get(id);

		const onChainResult = await stub.run({
			workflow: "onChainWorkflow",
			input: `onchain-${taskId}`,
		});

		console.log(`trigger fired at ${event.cron}: ${onChainResult.id}`);

		const macroResult = await stub.run({
			workflow: "macroWorkflow",
			input: `macro-${taskId}`,
		});

		console.log(`trigger fired at ${event.cron}: ${macroResult.id}`);
	},
} satisfies ExportedHandler<Env>;
