const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Goptimizepoc = require('../lib/goptimizepoc-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Goptimizepoc.GoptimizepocStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
