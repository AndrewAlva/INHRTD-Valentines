export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'qrTexture',
        type: 'texture',
        path: 'textures/qr-desktop.png'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'models/Fox/glTF/Fox.gltf'
    },

    {
        name: 'candyModel',
        type: 'objModel',
        path: 'models/Candies/heart.obj'
    },
    {
        name: 'candyDiffuseMap',
        type: 'texture',
        path: 'models/Candies/textures/diffuse.jpg'
    },
    {
        name: 'candyNormalsMap',
        type: 'texture',
        path: 'models/Candies/textures/bumpNormals.jpg'
    },
    {
        name: 'candyRoughnessMap',
        type: 'texture',
        path: 'models/Candies/textures/reflections.jpg'
    },

]