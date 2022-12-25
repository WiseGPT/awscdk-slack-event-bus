# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### SlackEventBus <a name="SlackEventBus" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus"></a>

#### Initializers <a name="Initializers" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.Initializer"></a>

```typescript
import { SlackEventBus } from '@wisegpt/awscdk-slack-event-bus'

new SlackEventBus(scope: Construct, id: string, props: SlackEventBusProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.Initializer.parameter.props">props</a></code> | <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusProps">SlackEventBusProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.Initializer.parameter.props"></a>

- *Type:* <a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusProps">SlackEventBusProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.slackEventsRequestUrl">slackEventsRequestUrl</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `slackEventsRequestUrl` <a name="slackEventsRequestUrl" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.slackEventsRequestUrl"></a>

```typescript
public slackEventsRequestUrl(appId?: string): string
```

###### `appId`<sup>Optional</sup> <a name="appId" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.slackEventsRequestUrl.parameter.appId"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.isConstruct"></a>

```typescript
import { SlackEventBus } from '@wisegpt/awscdk-slack-event-bus'

SlackEventBus.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.EventBus</code> | *No description.* |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.eventListenerLambdaLiveAlias">eventListenerLambdaLiveAlias</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.eventBus"></a>

```typescript
public readonly eventBus: EventBus;
```

- *Type:* aws-cdk-lib.aws_events.EventBus

---

##### `eventListenerLambdaLiveAlias`<sup>Required</sup> <a name="eventListenerLambdaLiveAlias" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.eventListenerLambdaLiveAlias"></a>

```typescript
public readonly eventListenerLambdaLiveAlias: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


## Structs <a name="Structs" id="Structs"></a>

### SlackEventBusProps <a name="SlackEventBusProps" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusProps"></a>

#### Initializer <a name="Initializer" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.Initializer"></a>

```typescript
import { SlackEventBusProps } from '@wisegpt/awscdk-slack-event-bus'

const slackEventBusProps: SlackEventBusProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.tokenSecret">tokenSecret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | `tokenSecret` is a reference to the Secret parameter that stores the. |

---

##### `tokenSecret`<sup>Required</sup> <a name="tokenSecret" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.tokenSecret"></a>

```typescript
public readonly tokenSecret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

`tokenSecret` is a reference to the Secret parameter that stores the.

---



