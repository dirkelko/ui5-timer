const assert = require("assert");

describe("ui5-timer rendering", async () => {
	before(async () => {
		await browser.url("test/pages/index.html");
	});

	it("tests if web component is correctly rendered", async () => {
		const innerContent = await browser.$("#myFirstComponent").shadow$("div");

		assert.ok(innerContent, "content rendered");
	});
});
