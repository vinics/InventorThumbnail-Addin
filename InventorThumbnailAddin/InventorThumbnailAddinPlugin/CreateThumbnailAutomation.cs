using Inventor;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace InventorThumbnailAddinPlugin
{
    [ComVisible(true)]
    public class CreateThumbnailAutomation
    {
        InventorServer m_server;

        public CreateThumbnailAutomation(InventorServer server)
        {
            m_server = server;
        }

        public void Run(Document document)
        {
            try
            {
                string fileNameImage = "thumbnail.bmp";
                string documentFolder = System.IO.Path.GetDirectoryName(document.FullFileName);
                string imageFilename = System.IO.Path.Combine(documentFolder, fileNameImage);

                if (document.DocumentType == DocumentTypeEnum.kPartDocumentObject)
                {
                    Camera camera = m_server.TransientObjects.CreateCamera();
                    camera.SceneObject = (document as PartDocument).ComponentDefinition;
                    camera.ViewOrientationType = ViewOrientationTypeEnum.kIsoTopRightViewOrientation;
                    camera.Fit();
                    camera.ApplyWithoutTransition();

                    Color backgroundColor = m_server.TransientObjects.CreateColor(0xEC, 0xEC, 0xEC, 0.0); // hardcoded. Make as a parameter

                    // generate image twice as large, and then downsample it (antialiasing)
                    camera.SaveAsBitmap(imageFilename, 512, 512, backgroundColor, backgroundColor);

                    //camera.SaveAsBitmap(imageFilename, 512, 512, Type.Missing, Type.Missing);
                }
            } catch (Exception e)
            {
                Trace.TraceError("Processing failed on thumbnail creation. " + e.ToString());
            }
        }

        public void RunWithArguments(Document document, NameValueMap args)
        {
            Run(document);
        }
    }
}
