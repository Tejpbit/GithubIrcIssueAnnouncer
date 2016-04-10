const expect = require('expect');

const index = require('../index');

describe('isAllowedToAskForIssue', () => {
    it("should allow Tejp when he's both in black- and whitelist", () => {
      const whitelist = ['Tejp']
      const blacklist = ['Tejp']
      expect(
        index.isAllowedToAskForIssue('Tejp', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should allow Tejp when he's in whitelist", () => {
      const whitelist = ['Tejp']
      const blacklist = []
      expect(
        index.isAllowedToAskForIssue('Tejp', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should NOT allow Tejp when he's in blacklist", () => {
      const whitelist = []
      const blacklist = ['Tejp']
      expect(
        index.isAllowedToAskForIssue('Tejp', whitelist, blacklist)
      ).toEqual(false)
    });

    it("should allow Tejp when black- and whitelist both are empty", () => {
      const whitelist = []
      const blacklist = []
      expect(
        index.isAllowedToAskForIssue('Tejp', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should allow Tejp when blacklist exists but he's not in it", () => {
      const whitelist = []
      const blacklist = ['SomeOtherGuy']
      expect(
        index.isAllowedToAskForIssue('Tejp', whitelist, blacklist)
      ).toEqual(true)
    });

    it("should NOT allow Tejp when whitelist exists but he's not in it", () => {
      const whitelist = ['SomeOtherGuy']
      const blacklist = []
      expect(
        index.isAllowedToAskForIssue('Tejp', whitelist, blacklist)
      ).toEqual(false)
    });
});
