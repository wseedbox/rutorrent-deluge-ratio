plugin.loadLang();

if(plugin.canChangeColumns())
{
	plugin.config = theWebUI.config;
	theWebUI.config = function(data)
	{
		this.tables.trt.columns.push({text: 'DlgRatio', width: '100px', id: 'dratio', type: TYPE_NUMBER});
		this.tables.trt.columns.push({text: 'TotalRatio', width: '100px', id: 'tratio', type: TYPE_NUMBER});
		plugin.trtFormat = this.tables.trt.format;
		plugin.config.call(this,data);
		plugin.reqId1 = theRequestManager.addRequest("trt", theRequestManager.map("d.get_custom=")+"deluge_ratio",function(hash,torrent,value)
		{
			torrent.dratio = value;
		});
		plugin.reqId2 = theRequestManager.addRequest("trt", theRequestManager.map("d.get_ratio="),function(hash,torrent,value)
		{
			total = Number(value)/1000 + Number(torrent.dratio);
			torrent.tratio = +total.toFixed(3);
		});
		plugin.trtRenameColumn();
	}

	plugin.trtRenameColumn = function()
	{
		if(plugin.allStuffLoaded)
		{
			theWebUI.getTable("trt").renameColumnById("dratio",theUILang.dratio);
			theWebUI.getTable("trt").renameColumnById("tratio",theUILang.tratio);
			if(thePlugins.isInstalled("rss"))
				plugin.rssRenameColumn();
			if(thePlugins.isInstalled("extsearch"))
				plugin.tegRenameColumn();
		}
		else
			setTimeout(arguments.callee,1000);
	}

	plugin.rssRenameColumn = function()
	{
		if(theWebUI.getTable("rss").created)
		{
			theWebUI.getTable("rss").renameColumnById("dratio",theUILang.dratio);
			theWebUI.getTable("rss").renameColumnById("tratio",theUILang.tratio);
		}
		else
			setTimeout(arguments.callee,1000);
	}

	plugin.tegRenameColumn = function()
	{
		if(theWebUI.getTable("teg").created)
		{
			theWebUI.getTable("teg").renameColumnById("dratio",theUILang.dratio);
			theWebUI.getTable("teg").renameColumnById("tratio",theUILang.tratio);
		}
		else
			setTimeout(arguments.callee,1000);
	}
}

plugin.onRemove = function()
{
	theWebUI.getTable("trt").removeColumnById("dratio");
	theWebUI.getTable("trt").removeColumnById("tratio");
	if(thePlugins.isInstalled("rss"))
	{
		theWebUI.getTable("rss").removeColumnById("dratio");
		theWebUI.getTable("rss").removeColumnById("tratio");
	}
	theRequestManager.removeRequest( "trt", plugin.reqId1 );
	theRequestManager.removeRequest( "trt", plugin.reqId2 );
}
