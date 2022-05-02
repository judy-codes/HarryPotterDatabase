-- Judy Wang

\c

-- drop tables if they already exist 
DROP TABLE IF EXISTS chapter;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS dialogue;
DROP TABLE IF EXISTS place; 
DROP TABLE IF EXISTS character;
DROP TABLE IF EXISTS spell;

-- creating tables 
CREATE TABLE chapter (
  chapter_id int NOT NULL,
  chapter_name VARCHAR(100),
  movie_id int, 
  movie_chapter VARCHAR(100),
  PRIMARY KEY (chapter_id),
  FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE
);

-- then copy my csv information over to these datatables
\copy chapter(chapter_id,chapter_name,movie_id,movie_chapter) from '~/HarryPotterDB/Chapters.csv' delimiter ',' csv header encoding 'windows-1251';

CREATE TABLE movie (
  movie_id int NOT NULL,
  movie VARCHAR(100) NOT NULL,
  release_year VARCHAR(4) NOT NULL,
  runtime VARCHAR(10) NOT NULL,
  budget VARCHAR(20) NOT NULL,
  box_office VARCHAR(50) NOT NULL,
  PRIMARY KEY (movie_id)
);

\copy movie(movie_id,movie,release_year,runtime,budget,box_office) from '~/HarryPotterDB/Movies.csv' delimiter ',' csv header encoding 'windows-1251';

CREATE TABLE dialogue (
  dialogue_id int NOT NULL,
  chapter_id int NOT NULL,
  place_id int NOT NULL,
  character_id int NOT NULL,
  dialogue VARCHAR(10000) NOT NULL,
  PRIMARY KEY (dialogue_id),
  FOREIGN KEY (chapter_id) REFERENCES chapter(chapter_id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES place(place_id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES character(character_id) ON DELETE CASCADE
);

\copy dialogue(dialogue_id,chapter_id,place_id,character_id,dialogue) from '~/HarryPotterDB/Dialogue.csv' delimiter ',' csv header encoding 'windows-1251';

CREATE TABLE place (
  place_id int NOT NULL,
  place_name VARCHAR(100),
  place_category VARCHAR(100),
  PRIMARY KEY (place_id)
);

\copy place(place_id,place_name,place_category) from '~/HarryPotterDB/Places.csv' delimiter ',' csv header encoding 'windows-1251';

CREATE TABLE character (
  character_id int NOT NULL,
  character_name VARCHAR(100) NOT NULL,
  species VARCHAR(100),
  gender VARCHAR(20),
  house VARCHAR(100),
  patronus VARCHAR(100),
  wand_wood VARCHAR(100),
  wand_core VARCHAR(100),
  PRIMARY KEY (character_id)
);

\copy character(character_id,character_name,species,gender,house,patronus,wand_wood, wand_core) from '~/HarryPotterDB/Characters.csv' delimiter ',' csv header encoding 'windows-1251';

CREATE TABLE spell (
  spell_id int NOT NULL,
  incantation VARCHAR(100),
  spell_name VARCHAR(100),
  effect VARCHAR(100),
  light VARCHAR(50),
  PRIMARY KEY (spell_id)
);

\copy spell(spell_id,incantation,spell_name,effect,light) from '~/HarryPotterDB/Spells.csv' delimiter ',' csv header encoding 'windows-1251';

