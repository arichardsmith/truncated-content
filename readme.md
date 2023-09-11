# Truncated Content

A custom element that hides any content that comes after a `<!-- more -->`
comment. It shows a button to toggle showing the extra content.

## Usage

Include the element in your HTML:

```html
<truncated-content>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
    gravida neque. Vivamus eleifend iaculis rhoncus. Etiam sed sollicitudin
    justo. Pellentesque vitae felis lorem. Proinsed sollicitudin massa. Maecenas
    quis sapien purus. Aliquam arius magnav purus, nec viverra neque faucibus
    in. Donec suscipit eros eu<!--more-->
    sem laoreet, sit amet pharetra ipsum ultricies. Nulla posuere tempor
    rhoncus.
  </p>
  <p>etc..</p>
  <p>etc..</p>
</truncated-content>
```

Then import the element and register it:

```ts
import { TruncatedContet } from "truncated-content";

TruncatedContent.define();
```

## Status

I put this together for a specific use case, which is no longer needed. There's
a lot that needs to be done to complete it, but I won't be working on it any
time soon.
