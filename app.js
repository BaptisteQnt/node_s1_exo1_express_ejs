const express = require('express');
const app = express();
const port = 3080;

app.set('view engine', 'ejs');

app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/', (req, res) => {
    res.render('home', { title: 'Accueil', message: 'Bienvenue sur node-s1 !'});
})

app.get('/propos', (req, res) => {
    res.render('about', {title: 'à propos', info: 'Ceci est une application test'});
});

app.get('/contact', (req, res) =>{ 
    res.render('contact', { title: 'contact', email: 'contact@exemple.com '});
});

app.get('/form', (req, res) => {
    res.render('form', { title: 'Formulaire de contact', submittedData: null });
});

app.get('/formGet', (req, res) => {
    res.render('formGet', { submittedData: req.query });
});

app.post('/form', (req, res) => {
    const formidable = require('formidable');
    const form = new formidable.IncomingForm();
  
    form.uploadDir = __dirname + '/uploads';
    form.keepExtensions = true;

    form.on('fileBegin', (name, file) => {
        console.log('Nom du champ :', name);
        console.log('Fichier reçu :', file);

        const originalName = file.originalFilename || file.name;
        if (!originalName) {
            console.error('Nom du fichier introuvable.');
            return;
        }

        file.filepath = form.uploadDir + '/' + originalName;
    });
  
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Erreur lors du parsing:', err);
            return res.send("Erreur lors du traitement du formulaire.");
        }

        console.log('Fichiers uploadés :', files);

        let imageName = null;
        if (Array.isArray(files.image) && files.image.length > 0) {
            imageName = files.image[0].originalFilename || files.image[0].name;
        } else if (files.image) {
            imageName = files.image.originalFilename || files.image.name;
        }

        console.log('Nom de l\'image :', imageName);

        const submittedData = { ...fields, image: imageName };
        res.render('form', { submittedData });
    });
  });
                                                     
app.listen(port, () => {
    console.log(`Le serveur est OK ! Port = ${port}`);
});