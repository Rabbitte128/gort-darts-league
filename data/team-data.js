const TEAM_DATA = {
  "Bradley's A": { league: "A League", established: "", about: "", 
    players: ["Declan Fuery", "Tony Brennan", "Pete Cosgrove", "Alan Hynes", "Johnny Bowels", "Daniel Cunningham", "Andy James", "Sean Dolphin"] 
//    honours: [{title: "A League", years: "2024"}, {title: "Buddy Burke Cup", years: "2024"},{title: "A League", years: "2023"}, {title: "A League", years: "2022"}] 
  },
  "Dicey's A": { league: "A League", established: "", about: "", 
    players: ["Kieran Harte", "Kyle McCarthy", "Darragh Darcy", "John King", "Donna Demansfield", "Mikey Daily", "Creg Molloy", "John Molloy", "Lorcan Devon"]
//    honours: [{title: "B League", years: "2024"}, {title: "B Shield", years: "2019"}, {title: "B Shield", years: "2017"}] 
  },
  "Dicey's B": { league: "A League", established: "", about: "", 
    players: ["Damien Foster", "Anto McDonagh", "David McDonagh", "Carl Mee", "Niall Stewart", "Anthony Keane", "Shane Sullivan", "Stephen Maloney"], 
//    honours: [{title: "B League", years: "2026"},{title: "Dave McGrath Cup", years: "2026"}, {title: "Dave McGrath Cup", years: "2024"}, {title: "B Shield", years: "2022"}, {title: "B Shield", years: "2016"}] 
  },
  "Hennelly's A": { league: "A League", established: "", about: "", 
    players: ["Conor Hennelly", "Gerry Fahey", "Kieran Broderick", "Tom Finneran", "Mark Devon", "Padraic Curley", "Gerry O'Donoghue", "Peter Kililea"], 
//    honours: [{title: "A League", years: "2026"}, {title: "A League", years: "2025"},{title: "Buddy Burke Cup", years: "2025"}, {title: "Buddy Burke Cup", years: "2023"}, {title: "A League", years: "2016"}, {title: "A League", years: "2013"}, {title: "A League", years: "2011"}, {title: "A League", years: "2002"}] 
  },
  "Hennelly's B": { league: "A League", established: "", about: "", 
    players: ["Gavin Lally", "Joe Moran", "Alan Fogarty", "Ciaran Earls", "Dan Noone", "Enda Cradock", "Stephen Divney", "Kevin Moran", "Stephen Broderick"], 
//    honours: [{title: "B League", years: "2021"}] 
  },
  "Mullins' A": { league: "A League", established: "", 
    players: ["Joe Flaherty", "Anthony Burke", "Kieran Burke", "Brian McDonnagh", "Dermot McDermot", "Noel McGrath", "Mickey Monnaghan", "Sean Monnaghan", "Brendan Daly"], 
//    honours: [{title: "Buddy Burke Cup", years: "2026"},{title: "Buddy Burke Cup", years: "2022"},{title: "A league", years: "2019"},{title: "B league", years: "2017"}] 
  },
  "Walsh's A": { league: "A League", established: "", about: "",
    players: ["Louise Kilmartin", "Bernard Kilmartin", "Michael Kilmartin", "Greg McManus", "Cathal Flaherty", "Conor Green", "Adrian Finn", "Ben Carew", "Christy Allen"]
//    honours: [{title: "B League", years: "2026"},{title: "Dave McGrath Cup", years: "2026"},{title: "B League", years: "2013"}] 
  },

  "Bradley's B": { league: "B League", established: "", about: "", 
    players: ["Paul Stankard", "Liam Hanley", "Oisin Higgins", "Neil Gardiner", "Darragh Geoghegan", "Mark Curtin", "Alex O'Flynn", "David Holland", "Sean Bermingham"], 
    honours: [] 
  },
  "Harte's": { league: "B League", established: "", about: "", 
    players: ["Niall Wynne", "Richard Joyce", "Gerard Cloran", "Eddie Reilly", "Daniel Kelly", "Ethan Daly", "Tom Linnane", "Paul Cloran"]
//    honours: [{title: "B Shield", years: "2024"}, {title: "B Shield", years: "2023"}] 
  },
  "Hennelly's C": { league: "B League", established: "", about: "", 
    players: ["Seamus Hennelly", "Sean Mahon", "Jason O'Donoghue", "Cian O'Laughlin", "Ferdia Touhey", "Brian Herrernan", "Calum Prendergast", "Ronan Burke", "Ollie Walsh"] 
  },
  "McCarthy's": { league: "B League", established: "", about: "", 
    players: ["Neil O'Halloran", "Mike Mullins", "Sean OG Keane", "Tagdh Mummery", "Nathan Corless", "Colman Dervan", "Flor Burke"],  
//    honours: [{title: "B League", years: "2017"},{title: "B League", years: "2014"},{title: "A League", years: "2007"}] 
  },
  "Mullins B": { league: "B League", established: "", about: "", 
    players: ["Declan Moran", "James Lynch", "Michael Rabbitte", "Eanna Melville", "Cameron Fennessey", "Colin Finnegan", "Steven Fahy", "Jack McGann", "Mark Deegan"], 
    honours: [] 
  },
  "O'Donnell's A": { league: "B League", established: "", about: "", 
    players: ["Lorcan Walsh", "James Gormally", "Niall Carr", "Ben Mulcair", "Nathan Smith", "Declan Flaherty", "Jack Linnane", "Daniel Cunningham"],  
//    honours: [{title: "B Shield", years: "2025"}] 
  },
  "O'Donnells B": { league: "B League", established: "", about: "", 
    players: ["Tiernan Finn", "Tiernan Walsh", "Caelem Walsh", "Shane Naughtan", "Dylan Murphy", "Niall Cunningham", "Joel Smith", "Pat Flaherty", "Paddy Cummins"],  
//    honours: [{title: "B Shield", years: "2026"}, {title: "B League", years: "2019"}] 
  },
  "The Lady Gregory": { league: "B League", established: "", about: "", 
    players: ["Stephen Fahey", "Barry McGarry", "Kianan Fahey", "Jarlath McDermott", "Killian Casey", "Jan Lipka", "Sean Kelly"], 
    honours: [] 
  },
  "The Ledger Bar": { league: "B League", established: "", about: "", 
    players: ["Stephen Geoghegan", "Jonathan McKeogh", "Patryk Lipka", "Rachel Fleming", "Senan Redmond", "Aiden Hall", "James Egan", "Michael Coffey", "Tomek Krol"],
    honours: [] 
  },
  "Walsh's B": { league: "B League", established: "", about: "", 
    players: ["Hughie O'Donnell", "Colm Kelly", "Johnny Niland", "Ivon McGrath", "Michael Diviney", "Dave Goodison", "Gerard Lally", "Barry McNeoin", "Kristin Keane"], 
    honours: [] 
  }
};
