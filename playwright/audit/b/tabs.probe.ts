import {test} from '@playwright/test';

import {press} from '../../helpers/liferay';

//
// A synthetic tab strip, no Liferay involved. Clicking the second tab marks
// it selected at once; what happens to its pane is the case under test.
//
function html(pane2: string, controls: boolean, onClick = '') {
	return `<html><head><style>
		.fade{opacity:0;transition:opacity .15s linear}.fade.show{opacity:1}
		.tab-pane{display:none}.tab-pane.active{display:block}
	</style></head><body>
	<ul role="tablist">
		<li><button role="tab" id="t1" aria-selected="true" ${controls ? 'aria-controls="p1"' : ''}>Performance</button></li>
		<li><button role="tab" id="t2" aria-selected="false" ${controls ? 'aria-controls="p2"' : ''} onclick="document.getElementById('t1').setAttribute('aria-selected','false');this.setAttribute('aria-selected','true');document.getElementById('p1').className='tab-pane fade';${onClick}">PageSpeed Insights</button></li>
	</ul>
	<div class="tab-content">
		<div role="tabpanel" id="p1" class="tab-pane fade active show">Render times are approximate</div>
		${pane2}
	</div></body></html>`;
}

const CASES: Array<[string, string]> = [
	['hidden pane (display none), aria-controls', html('<div role="tabpanel" id="p2" class="tab-pane fade">Configure Google PageSpeed</div>', true)],
	['shown but faded (active, no show), aria-controls', html('<div role="tabpanel" id="p2" class="tab-pane fade">Configure Google PageSpeed</div>', true, "document.getElementById('p2').className='tab-pane fade active';")],
	['pane fades in after 1s, aria-controls', html('<div role="tabpanel" id="p2" class="tab-pane fade">Configure Google PageSpeed</div>', true, "setTimeout(()=>{document.getElementById('p2').className='tab-pane fade active show'},1000);")],
	['hidden pane, NO aria-controls', html('<div role="tabpanel" id="p2" class="tab-pane fade">Configure Google PageSpeed</div>', false)],
	['hidden pane, NO aria-controls, no role=tabpanel', html('<div id="p2" class="tab-pane fade">Configure Google PageSpeed</div>', false).replace('role="tabpanel" id="p1"', 'id="p1"')],
	['aria-controls to missing id, other pane visible', html('<div role="tabpanel" id="p2x" class="tab-pane fade">Configure</div>', true, "document.getElementById('p1').className='tab-pane fade active show';")],
];

for (const [name, content] of CASES) {
	test(`tab check: ${name}`, async ({page}) => {
		await page.setContent(content);
		const started = Date.now();
		try {
			await press(page, 'PageSpeed Insights');
			console.log(`PROBE [${name}] press ACCEPTED after ${Date.now() - started}ms`);
		}
		catch (error) {
			console.log(`PROBE [${name}] press REJECTED after ${Date.now() - started}ms: ${String((error as Error).message).split('\n')[0]}`);
		}
	});
}
