# Snapshot report for `tests/cases/jsx.test.mjs`

The actual snapshot is saved in `jsx.test.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## Embedded JSX Expressions

> Embedded Expression

    `function HelloWorld() {␊
    ␊
      const children = <img id={greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase()}␊
        src={user.avatarUrl}/>;␊
    ␊
      const element = (␊
        <h1 className="greeting">␊
          Hello, world!␊
        </h1>␊
      );␊
    ␊
      return <div className='HelloWorld'␊
        title={\`You are visitor number ${num}\`}␊
        onMouseOver={onMouseOver}>␊
    ␊
        <strong>␊
          {greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase()}␊
        </strong>␊
    ␊
      </div>;␊
    ␊
    }`

## Apply markup rules to content

> { markup: { forceAttribute: true }}

    `function HelloWorld() {␊
    ␊
      const children = <img␊
        id={greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase()}␊
        src={user.avatarUrl}/>;␊
    ␊
      const element = (␊
        <h1␊
          className="greeting">␊
          Hello, world!␊
        </h1>␊
      );␊
    ␊
      return <div␊
        className='HelloWorld'␊
        title={\`You are visitor number ${num}\`}␊
        onMouseOver={onMouseOver}>␊
    ␊
        <strong>␊
          {greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase()}␊
        </strong>␊
    ␊
      </div>;␊
    ␊
    }`