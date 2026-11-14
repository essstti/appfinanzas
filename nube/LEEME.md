# nube/

- `firebase.js`: pedacito de Firebase 13.1.0 (login con Google + Firestore liviano), armado una sola vez y guardado acá para no depender de otra página.
- `entrada.js`: la receta con la que se armó.

Para rearmarlo (solo si hace falta actualizar Firebase):

```
npm i firebase@13.1.0 esbuild
npx esbuild entrada.js --bundle --format=esm --minify --legal-comments=eof --target=es2020,safari15 --outfile=firebase.js
```

## Reglas de Firestore (pegarlas en Firebase → Firestore Database → Reglas)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cada cuenta solo puede ver y tocar SU documento (y los datos van cifrados)
    match /usuarios/{uid} {
      allow get, delete: if request.auth != null && request.auth.uid == uid;
      allow create, update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['v','rev','salt','iv','datos','gz','actualizado'])
        && request.resource.data.datos is bytes
        && request.resource.data.datos.size() < 1000000
        && request.resource.data.rev is int;
    }
  }
}
```
