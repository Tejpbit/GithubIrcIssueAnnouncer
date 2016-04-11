const expect = require('expect');

const index = require('../index');

describe('isAllowedToAskForIssue', () => {
    it("should allow when in both black- and whitelist", () => {
      const whitelist = ['Foo']
      const blacklist = ['Foo']
      expect(
        index.isAllowedToAskForIssue('Foo', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should allow when in whitelist", () => {
      const whitelist = ['Foo']
      const blacklist = []
      expect(
        index.isAllowedToAskForIssue('Foo', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should NOT allow when in blacklist and there is no whitelist", () => {
      const whitelist = []
      const blacklist = ['Foo']
      expect(
        index.isAllowedToAskForIssue('Foo', whitelist, blacklist)
      ).toEqual(false)
    });

    it("should allow when black- and whitelist both are empty", () => {
      const whitelist = []
      const blacklist = []
      expect(
        index.isAllowedToAskForIssue('Foo', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should allow when blacklist exists but not in it", () => {
      const whitelist = []
      const blacklist = ['SomeOtherGuy']
      expect(
        index.isAllowedToAskForIssue('Foo', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should NOT allow when whitelist exists but he's not in it", () => {
      const whitelist = ['SomeOtherGuy']
      const blacklist = []
      expect(
        index.isAllowedToAskForIssue('Foo', whitelist, blacklist)
      ).toEqual(false)
    });
});
