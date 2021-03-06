import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    const imageUrl = req.query.image_url
    if (!imageUrl) {
      res.status(400).send("The query param 'image_url' is not set.")
    } else {
      if (typeof(imageUrl) === "string")
      await filterImageFromURL(imageUrl).then((filteredImagePath) => {
        res.sendFile(filteredImagePath, () => {
          deleteLocalFiles([filteredImagePath])
        })
      }).catch((error: any) => {
          res.status(400).send(`The following error occured: ${error}`)
        })
    }
  })

  app.get( "/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  app.listen( port, () => {
      console.log( `server running on http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();