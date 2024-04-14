-- Create 'links' table --
CREATE TABLE links (
	id serial4 NOT NULL,
	link varchar(2048) NOT NULL DEFAULT '',
	CONSTRAINT links_pkey PRIMARY KEY (id)
);

-- Create alias table --
-- id is set to a serial so it doesn't need to be manually incremented --
CREATE TABLE alias (
	id serial4 NOT NULL,
	link_id int4 NULL,
	alias varchar(6) NOT NULL,
	CONSTRAINT alias_pkey PRIMARY KEY (id),
	CONSTRAINT alias_unique UNIQUE (alias),
	CONSTRAINT link_fk 
        FOREIGN KEY (link_id) 
            REFERENCES links(id)
);