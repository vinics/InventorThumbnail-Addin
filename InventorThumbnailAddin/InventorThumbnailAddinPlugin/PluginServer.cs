/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

using Inventor;
using System;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;

namespace InventorThumbnailAddinPlugin
{
    [Guid("c079e3b2-a318-4a6a-93a9-35e8ff2fb000")]
    public class PluginServer : ApplicationAddInServer
    {
        // Inventor application object.
        private InventorServer _inventorServer;
        public dynamic Automation { get; private set; }

        public void Activate(ApplicationAddInSite addInSiteObject, bool firstTime)
        {
            Trace.TraceInformation(": CreateThumbnailPlugin (" + Assembly.GetExecutingAssembly().GetName().Version.ToString(4) + "): initializing...");
            // Initialize AddIn members.
            _inventorServer = addInSiteObject.InventorServer;
            Automation = new CreateThumbnailAutomation(_inventorServer);
        }

        public void Deactivate()
        {
            // Release objects.
            Trace.TraceInformation(": CreateThumbnailPlugin: deactivating... ");
            Marshal.ReleaseComObject(_inventorServer);
            _inventorServer = null;

            GC.Collect();
            GC.WaitForPendingFinalizers();
        }

        public void ExecuteCommand(int CommandID)
        {
            // obsolete
        }

    }
}
