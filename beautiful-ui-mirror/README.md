# Beautiful UI — Official Site Mirror

Static mirror of [beautiful-ui-five.vercel.app](https://beautiful-ui-five.vercel.app) for hosting when the original deployment is inaccessible.

Built by [Turbo Design](https://turbodesign.co/). This folder is deployed to GitHub Pages via CI.

To refresh the mirror:

```bash
wget -r -l 3 -np -nH -E -p -k -e robots=off \
  --domains=beautiful-ui-five.vercel.app \
  https://beautiful-ui-five.vercel.app/
```
