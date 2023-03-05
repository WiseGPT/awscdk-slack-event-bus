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
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.slackHandlerLambdaAlias">slackHandlerLambdaAlias</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

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

##### `slackHandlerLambdaAlias`<sup>Required</sup> <a name="slackHandlerLambdaAlias" id="@wisegpt/awscdk-slack-event-bus.SlackEventBus.property.slackHandlerLambdaAlias"></a>

```typescript
public readonly slackHandlerLambdaAlias: IFunction;
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
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.secret">secret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | `secret` is a reference to the Secret parameter that stores the signing-secret and also if oAuth enabled; |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.eventBusName">eventBusName</a></code> | <code>string</code> | `eventBusName` optional name to override the event bus name. |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.httpApi">httpApi</a></code> | <code>@aws-cdk/aws-apigatewayv2-alpha.HttpApi</code> | `httpApi` optional HTTP API to use, instead of Construct creating a new one. |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.singleApp">singleApp</a></code> | <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps">SlackEventBusSingleAppProps</a></code> | `singleApp` optionally configure to use a single application with fixed app id and path to use. |

---

##### `secret`<sup>Required</sup> <a name="secret" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.secret"></a>

```typescript
public readonly secret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

`secret` is a reference to the Secret parameter that stores the signing-secret and also if oAuth enabled;

client id / client secret for each individual appId

---

##### `eventBusName`<sup>Optional</sup> <a name="eventBusName" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.eventBusName"></a>

```typescript
public readonly eventBusName: string;
```

- *Type:* string

`eventBusName` optional name to override the event bus name.

---

##### `httpApi`<sup>Optional</sup> <a name="httpApi" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.httpApi"></a>

```typescript
public readonly httpApi: HttpApi;
```

- *Type:* @aws-cdk/aws-apigatewayv2-alpha.HttpApi

`httpApi` optional HTTP API to use, instead of Construct creating a new one.

---

##### `singleApp`<sup>Optional</sup> <a name="singleApp" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusProps.property.singleApp"></a>

```typescript
public readonly singleApp: SlackEventBusSingleAppProps;
```

- *Type:* <a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps">SlackEventBusSingleAppProps</a>

`singleApp` optionally configure to use a single application with fixed app id and path to use.

---

### SlackEventBusSingleAppProps <a name="SlackEventBusSingleAppProps" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps"></a>

#### Initializer <a name="Initializer" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps.Initializer"></a>

```typescript
import { SlackEventBusSingleAppProps } from '@wisegpt/awscdk-slack-event-bus'

const slackEventBusSingleAppProps: SlackEventBusSingleAppProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps.property.appId">appId</a></code> | <code>string</code> | `appId` to use for all request validating. |
| <code><a href="#@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps.property.eventsApiPath">eventsApiPath</a></code> | <code>string</code> | `eventsApiPath` which would be used for the events path. |

---

##### `appId`<sup>Required</sup> <a name="appId" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps.property.appId"></a>

```typescript
public readonly appId: string;
```

- *Type:* string

`appId` to use for all request validating.

---

##### `eventsApiPath`<sup>Required</sup> <a name="eventsApiPath" id="@wisegpt/awscdk-slack-event-bus.SlackEventBusSingleAppProps.property.eventsApiPath"></a>

```typescript
public readonly eventsApiPath: string;
```

- *Type:* string

`eventsApiPath` which would be used for the events path.

---



