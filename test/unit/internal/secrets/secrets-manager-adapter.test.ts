import { SecretsManagerAdapter } from "../../../../src/internal/secrets/secrets-manager-adapter";

describe("SecretsManagerAdapter", () => {
  const secretArn = "test-secret-arn";

  let mockSecretsManagerClient: any;
  let secretsManagerAdapter: SecretsManagerAdapter;

  beforeEach(() => {
    mockSecretsManagerClient = {
      send: jest.fn(),
    };

    secretsManagerAdapter = new SecretsManagerAdapter(
      secretArn,
      mockSecretsManagerClient
    );
  });

  describe("retrieve()", () => {
    it("should retrieve and parse secret", async () => {
      const expectedSecretValue = { foo: "bar", baz: { qux: "1" } };

      mockSecretsManagerClient.send.mockResolvedValue({
        SecretString: JSON.stringify(expectedSecretValue),
      } as any);

      const result = await secretsManagerAdapter.retrieve();

      expect(result).toEqual(expectedSecretValue);

      expect(mockSecretsManagerClient.send).toHaveBeenCalledTimes(1);
      expect(
        mockSecretsManagerClient.send.mock.calls[0][0].input.SecretId
      ).toEqual(secretArn);
    });
  });
});
