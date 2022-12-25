import { EventBusAdapter } from "../../../../src/internal/event-bus/event-bus-adapter";

describe("EventBusAdapter", () => {
  const input = {
    time: new Date(1518467820000),
    source: "mock-source",
    detailType: "mock-detail-type",
    detail: { foo: "bar" },
  };

  const eventBusName = "event-bus-name";
  let mockEventBridgeClient: any;
  let eventBusAdapter: EventBusAdapter;

  beforeEach(() => {
    mockEventBridgeClient = { send: jest.fn() };

    eventBusAdapter = new EventBusAdapter(eventBusName, mockEventBridgeClient);
  });

  describe("send()", () => {
    it("should send events", async () => {
      mockEventBridgeClient.send.mockResolvedValue(void 0);

      const result = await eventBusAdapter.send(input);

      expect(result).toBeUndefined();
      expect(mockEventBridgeClient.send.mock.calls[0][0].input)
        .toMatchInlineSnapshot(`
        Object {
          "Entries": Array [
            Object {
              "Detail": "{\\"foo\\":\\"bar\\"}",
              "DetailType": "mock-detail-type",
              "EventBusName": "event-bus-name",
              "Source": "mock-source",
              "Time": 2018-02-12T20:37:00.000Z,
            },
          ],
        }
      `);
    });
  });
});
