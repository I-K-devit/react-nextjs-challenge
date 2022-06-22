To test this project:
1. Pull this repository into your machine;
2. Runs the "npm run dev" in the terminal that is located in the project folder;
3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Things that left to do: 
1.  Display "Refetch" button if "Show all" filter is displaying less than 100 of total available articles,
meaning that we've been deleting some of the articles
2. Display "toggle" button which shows the dropdown list of currently available categories with
another button next to each category that removes every articles from that category
3. Both search input and active category filter should be persisted in URL in real time with query
and filter params, respectively. This also means that opening a direct URL in new tab, such as
http://localhost:3000/?query=guardian&filter=1 should show the expected results, have
the "X Universe" category preselected and search input should be "guardian", data should also
be pre-fetch server side with proper SSR because performing curl request should give us the

...Also re-style most of the components and fixing some of the minor bugs (for example do not make filter buttons bringing back removed articles)