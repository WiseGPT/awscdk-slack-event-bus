import { SlackSecretsService } from "../../../../src/internal/secrets/slack-secrets.service";

describe("SlackSecretsService", () => {
  let mockSecretsManagerAdapter: any;
  let slackSecretsService: SlackSecretsService;

  beforeEach(() => {
    mockSecretsManagerAdapter = {
      retrieve: jest.fn(),
    };

    slackSecretsService = new SlackSecretsService(mockSecretsManagerAdapter);
  });

  describe("retrieve()", () => {
    it("should map app secrets correctly", async () => {
      const secrets = {
        "app/APP01/signing-secret": "foo",
        "another-secret": "value",
        "app/APP01/another-secret": "value",
        "app/APP02/signing-secret": "bar",
      };

      const expectedResult = {
        APP01: { signingSecret: "foo" },
        APP02: { signingSecret: "bar" },
      };

      mockSecretsManagerAdapter.retrieve.mockResolvedValue(secrets);

      const result = await slackSecretsService.retrieve();

      expect(result).toEqual(expectedResult);
    });

    it("should cache the result correctly", async () => {
      const secrets = {
        "app/APP01/signing-secret": "foo",
        "another-secret": "value",
        "app/APP01/another-secret": "value",
        "app/APP02/signing-secret": "bar",
      };

      const expectedResult = {
        APP01: { signingSecret: "foo" },
        APP02: { signingSecret: "bar" },
      };

      mockSecretsManagerAdapter.retrieve.mockResolvedValue(secrets);

      const [result1, result2] = await Promise.all([
        slackSecretsService.retrieve(),
        slackSecretsService.retrieve(),
      ]);

      expect(result1).toEqual(expectedResult);
      expect(result2).toEqual(expectedResult);
      expect(mockSecretsManagerAdapter.retrieve).toHaveBeenCalledTimes(1);
    });
  });
});
