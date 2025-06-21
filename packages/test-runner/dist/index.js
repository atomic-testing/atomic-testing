
//#region src/testRunner.ts
const emptyGoto = (_url) => {};
function testRunner(testSuiteInfo, testMethod, interactionInterface) {
	const suites = Array.isArray(testSuiteInfo) ? testSuiteInfo : [testSuiteInfo];
	const { getTestEngine } = interactionInterface;
	suites.forEach((suite) => {
		const { title, tests, url } = suite;
		testMethod.describe(title ?? "", () => {
			testMethod.beforeEach(function({ page: _page }) {
				let done = void 0;
				let parameters = void 0;
				const passIn = arguments[0];
				if (typeof passIn === "function") done = passIn;
				else parameters = passIn;
				if ("goto" in interactionInterface) {
					const cb = interactionInterface.goto(url, parameters);
					if (cb instanceof Promise) return cb.finally(() => {
						done?.();
					});
					else return done?.();
				}
				return done?.();
			});
			tests(getTestEngine, testMethod);
		});
	});
}

//#endregion
exports.emptyGoto = emptyGoto;
exports.testRunner = testRunner;
//# sourceMappingURL=index.js.map