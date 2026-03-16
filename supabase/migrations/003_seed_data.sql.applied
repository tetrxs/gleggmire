-- gleggmire.net — Glexicon Seed Data
-- Starter glossary entries from Video 2 + additional terms
-- All entries: status='approved', verified_by_gleggmire=true, created_by=system user

-- ============================================
-- VIDEO 2 CLIP
-- ============================================
INSERT INTO clips (id, source, external_url, external_id, title, submitted_by, upvotes)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'youtube',
  'https://www.youtube.com/watch?v=bJGv-LhdIPE',
  'bJGv-LhdIPE',
  'Gleggmire Glexicon Video 2',
  '00000000-0000-0000-0000-000000000000',
  0
);

-- ============================================
-- HELPER: system user ID
-- ============================================
-- System user: 00000000-0000-0000-0000-000000000000

-- ============================================
-- VIDEO 2 TERMS (with timecodes)
-- ============================================

-- 1. Situationsbedingt (01:45 = 105s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'situationsbedingt', 'Situationsbedingt', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Informeller Ausdruck, oft als Frage verwendet, um eine Person zu provozieren oder eine Reaktion zu testen.', 'Informeller Ausdruck, oft als Frage verwendet, um eine Person zu provozieren oder eine Reaktion zu testen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Trolling'), (tid, 'Provokation');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 105, '00000000-0000-0000-0000-000000000000');
END $$;

-- 2. Sirs (SS) (02:26 = 146s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'sirs-ss', 'Sirs (SS)', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Informelle Begruessung im Gefangenen-RP, um nicht aus der Rolle zu fallen.', 'Informelle Begruessung im Gefangenen-RP, um nicht aus der Rolle zu fallen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Begruessung');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'SS', 'ss');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 146, '00000000-0000-0000-0000-000000000000');
END $$;

-- 3. Luftgaming (03:00 = 180s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'luftgaming', 'Luftgaming', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Gaming-Aktivitaeten die in der Luft stattfinden, z.B. im Flugzeug.', 'Gaming-Aktivitaeten die in der Luft stattfinden, z.B. im Flugzeug.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Gaming'), (tid, 'Meta');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 180, '00000000-0000-0000-0000-000000000000');
END $$;

-- 4. Zaubermagnada (03:45 = 225s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'zaubermagnada', 'Zaubermagnada', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Ein Gegenstand / Zauberstab aus der fiktiven Substanz "Magnada".', 'Ein Gegenstand / Zauberstab aus der fiktiven Substanz "Magnada".', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Lore'), (tid, 'Items');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Magnada', 'magnada');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 225, '00000000-0000-0000-0000-000000000000');
END $$;

-- 5. Fick Manu (04:13 = 253s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'fick-manu', 'Fick Manu', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Alter Insider. Vulgaere Aufforderung an eine Person namens Manu, sich zu entfernen.', 'Alter Insider. Vulgaere Aufforderung an eine Person namens Manu, sich zu entfernen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Insider'), (tid, 'Vulgaer');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 253, '00000000-0000-0000-0000-000000000000');
END $$;

-- 6. Slices (04:49 = 289s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'slices', 'Slices', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Jemanden im Spiel mit einem Messer stechen (in den Allerwertesten).', 'Jemanden im Spiel mit einem Messer stechen (in den Allerwertesten).', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Gewalt');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 289, '00000000-0000-0000-0000-000000000000');
END $$;

-- 7. Lungen-Torpedo (05:20 = 320s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'lungen-torpedo', 'Lungen-Torpedo', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Synonym fuer eine bestimmte Art zu rauchen im Spiel.', 'Synonym fuer eine bestimmte Art zu rauchen im Spiel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Rauchen');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Kraeuterlunte', 'kraeuterlunte');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 320, '00000000-0000-0000-0000-000000000000');
END $$;

-- 8. Kraeuterlunte (05:20 = 320s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'kraeuterlunte', 'Kraeuterlunte', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Synonym fuer Lungen-Torpedo. Andere Art des Rauchens im RP.', 'Synonym fuer Lungen-Torpedo. Andere Art des Rauchens im RP.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Rauchen');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Lungen-Torpedo', 'lungen-torpedo');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 320, '00000000-0000-0000-0000-000000000000');
END $$;

-- 9. Kanackentasche (05:55 = 355s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'kanackentasche', 'Kanackentasche', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Anderes Wort fuer Doener.', 'Anderes Wort fuer Doener.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Essen'), (tid, 'Slang');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 355, '00000000-0000-0000-0000-000000000000');
END $$;

-- 10. Goi (06:21 = 381s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'goi', 'Goi', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Beschreibt eine unangenehme, langweilige oder oede Situation.', 'Beschreibt eine unangenehme, langweilige oder oede Situation.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Gefuehl'), (tid, 'Reaktion');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES
    (tid, 'Gy', 'gy'),
    (tid, 'Schleim', 'schleim'),
    (tid, 'Verschleimt', 'verschleimt');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 381, '00000000-0000-0000-0000-000000000000');
END $$;

-- 11. Gy (06:21 = 381s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'gy', 'Gy', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Alias fuer Goi.', 'Alias fuer Goi.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Gefuehl'), (tid, 'Reaktion');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Goi', 'goi');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 381, '00000000-0000-0000-0000-000000000000');
END $$;

-- 12. Schleim (06:50 = 410s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'schleim', 'Schleim', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Gleichbedeutend mit Goi — wenn etwas mega oede oder komisch ist.', 'Gleichbedeutend mit Goi — wenn etwas mega oede oder komisch ist.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Gefuehl'), (tid, 'Reaktion');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES
    (tid, 'Goi', 'goi'),
    (tid, 'Verschleimt', 'verschleimt');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 410, '00000000-0000-0000-0000-000000000000');
END $$;

-- 13. Verschleimt (06:50 = 410s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'verschleimt', 'Verschleimt', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Zustand der Schleimigkeit. Gleichbedeutend mit Goi.', 'Zustand der Schleimigkeit. Gleichbedeutend mit Goi.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Gefuehl'), (tid, 'Reaktion');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES
    (tid, 'Schleim', 'schleim'),
    (tid, 'Goi', 'goi');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 410, '00000000-0000-0000-0000-000000000000');
END $$;

-- 14. Steifen RP (07:21 = 441s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'steifen-rp', 'Steifen RP', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn man im Rollenspiel eine unangenehme, peinliche oder "steife" Situation erlebt.', 'Wenn man im Rollenspiel eine unangenehme, peinliche oder "steife" Situation erlebt.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Klassiker');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 441, '00000000-0000-0000-0000-000000000000');
END $$;

-- 15. Styling Gel (08:13 = 493s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'styling-gel', 'Styling Gel', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn einem im Spiel die Haare vom Kopf fallen. Metapher fuer eine unerwartete negative Veraenderung.', 'Wenn einem im Spiel die Haare vom Kopf fallen. Metapher fuer eine unerwartete negative Veraenderung.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Meta'), (tid, 'Humor');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Haarglatzfall', 'haarglatzfall');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 493, '00000000-0000-0000-0000-000000000000');
END $$;

-- 16. Haarglatzfall (erblich bedingt) (08:13 = 493s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'haarglatzfall-erblich-bedingt', 'Haarglatzfall (erblich bedingt)', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Alias fuer Styling Gel. Wenn man ploetzlich kahl wird.', 'Alias fuer Styling Gel. Wenn man ploetzlich kahl wird.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Meta'), (tid, 'Humor');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Styling Gel', 'styling-gel');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 493, '00000000-0000-0000-0000-000000000000');
END $$;

-- 17. Komplett (09:07 = 547s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'komplett', 'Komplett', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Absolute Zustimmung oder Situation des Grauens. Wird mit einem "O" der Finger ausgedrueckt.', 'Absolute Zustimmung oder Situation des Grauens. Wird mit einem "O" der Finger ausgedrueckt.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Reaktion'), (tid, 'Klassiker');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 547, '00000000-0000-0000-0000-000000000000');
END $$;

-- 18. Kaniel (09:52 = 592s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'kaniel', 'Kaniel', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Bezeichnung fuer den YouTuber Kaniel Lizi (Daniel / Danileigh).', 'Bezeichnung fuer den YouTuber Kaniel Lizi (Daniel / Danileigh).', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Personen'), (tid, 'Insider');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Kaniel Lizi', 'kaniel-lizi');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 592, '00000000-0000-0000-0000-000000000000');
END $$;

-- 19. Drecksgaul (10:08 = 608s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'drecksgaul', 'Drecksgaul', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Liebevoll-beleidigender Begriff fuer ein Pferd im Spiel.', 'Liebevoll-beleidigender Begriff fuer ein Pferd im Spiel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Tiere');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 608, '00000000-0000-0000-0000-000000000000');
END $$;

-- 20. Lattenrost (10:40 = 640s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'lattenrost', 'Lattenrost', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Vielseitig nutzbarer Begriff, oft im Kontext Bett/Schlafen.', 'Vielseitig nutzbarer Begriff, oft im Kontext Bett/Schlafen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Slang'), (tid, 'Meta');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 640, '00000000-0000-0000-0000-000000000000');
END $$;

-- 21. Verschmieren (10:58 = 658s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'verschmieren', 'Verschmieren', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Eine Fluessigkeit oder einen Gegenstand zwischen den Haenden verreiben. Immer mit "schoen" davor.', 'Eine Fluessigkeit oder einen Gegenstand zwischen den Haenden verreiben. Immer mit "schoen" davor.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Aktion'), (tid, 'Vulgaer');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 658, '00000000-0000-0000-0000-000000000000');
END $$;

-- 22. Ejakulat (11:24 = 684s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'ejakulat', 'Ejakulat', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Teil von "schoen verschmieren". Wird als Teil dieser Aktion definiert.', 'Teil von "schoen verschmieren". Wird als Teil dieser Aktion definiert.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 684, '00000000-0000-0000-0000-000000000000');
END $$;

-- 23. Snench (11:43 = 703s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'snench', 'Snench', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Alternatives Wort fuer Mensch.', 'Alternatives Wort fuer Mensch.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Slang'), (tid, 'Ersatzwort');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 703, '00000000-0000-0000-0000-000000000000');
END $$;

-- 24. Schiessens (11:55 = 715s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'schiessens', 'Schiessens', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn man im Spiel schiesst. Das "s" am Ende ist Teil des Begriffs.', 'Wenn man im Spiel schiesst. Das "s" am Ende ist Teil des Begriffs.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Aktion');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 715, '00000000-0000-0000-0000-000000000000');
END $$;

-- 25. Auto bepimpen (12:15 = 735s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'auto-bepimpen', 'Auto bepimpen', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Das Auto von jemandem im Spiel komplett tunen.', 'Das Auto von jemandem im Spiel komplett tunen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Fahrzeuge');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 735, '00000000-0000-0000-0000-000000000000');
END $$;

-- 26. Fick Toast (12:36 = 756s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'fick-toast', 'Fick Toast', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Ein Toast mit einem Loch in der Mitte.', 'Ein Toast mit einem Loch in der Mitte.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Essen'), (tid, 'Humor');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 756, '00000000-0000-0000-0000-000000000000');
END $$;

-- 27. Schwakau (13:00 = 780s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'schwakau', 'Schwakau', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Abkuerzung fuer "Schwanz kauen" — sexuelle Handlung im Spiel.', 'Abkuerzung fuer "Schwanz kauen" — sexuelle Handlung im Spiel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Schwa', 'schwa');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 780, '00000000-0000-0000-0000-000000000000');
END $$;

-- 28. Peblow (13:13 = 793s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'peblow', 'Peblow', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Jemandem im Spiel den Penis blasen (anblowen).', 'Jemandem im Spiel den Penis blasen (anblowen).', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 793, '00000000-0000-0000-0000-000000000000');
END $$;

-- 29. DFZ (13:48 = 828s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'dfz', 'DFZ', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Ein Furz im Rollenspiel. Abkuerzung fuer "Dicker Forz".', 'Ein Furz im Rollenspiel. Abkuerzung fuer "Dicker Forz".', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Humor');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Forz im RP', 'forz-im-rp');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 828, '00000000-0000-0000-0000-000000000000');
END $$;

-- 30. Eigene Meimung (13:55 = 835s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'eigene-meimung', 'Eigene Meimung', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Die eigene Meinung. Absichtlich mit "m" statt "n" geschrieben.', 'Die eigene Meinung. Absichtlich mit "m" statt "n" geschrieben.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Slang'), (tid, 'Rechtschreibung');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Meimung', 'meimung');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 835, '00000000-0000-0000-0000-000000000000');
END $$;

-- 31. Angeschniedelt (14:05 = 845s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'angeschniedelt', 'Angeschniedelt', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn man jemanden bereits stark provoziert und in die Enge getrieben hat.', 'Wenn man jemanden bereits stark provoziert und in die Enge getrieben hat.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Trolling'), (tid, 'Zustand');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 845, '00000000-0000-0000-0000-000000000000');
END $$;

-- 32. Sar (14:34 = 874s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'sar', 'Sar', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Leute die Marcel heissen — aber in einer besseren Version.', 'Leute die Marcel heissen — aber in einer besseren Version.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Personen'), (tid, 'Insider');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 874, '00000000-0000-0000-0000-000000000000');
END $$;

-- 33. Abend (14:44 = 884s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'abend', 'Abend', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Simple Begruessung.', 'Simple Begruessung.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Begruessung');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Nabend', 'nabend');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 884, '00000000-0000-0000-0000-000000000000');
END $$;

-- 34. Nabend (14:44 = 884s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'nabend', 'Nabend', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Kurzform von "Guten Abend". Simple Begruessung.', 'Kurzform von "Guten Abend". Simple Begruessung.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Begruessung');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Abend', 'abend');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 884, '00000000-0000-0000-0000-000000000000');
END $$;

-- 35. Querlatte (14:44 = 884s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'querlatte', 'Querlatte', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Eine Platte mit einem 45-Grad-Winkel.', 'Eine Platte mit einem 45-Grad-Winkel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Objekte'), (tid, 'Slang');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 884, '00000000-0000-0000-0000-000000000000');
END $$;

-- 36. Kuehles Blondes (15:03 = 903s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'kuehles-blondes', 'Kuehles Blondes', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Ein Bier.', 'Ein Bier.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Getraenke'), (tid, 'Slang');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 903, '00000000-0000-0000-0000-000000000000');
END $$;

-- 37. Ja ja ja ja ja (Pue) (15:09 = 909s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'ja-ja-ja-ja-ja-pue', 'Ja ja ja ja ja (Pue)', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Geraeusch zur Bestaetigung im Gefangenen-RP um nicht aufzufallen.', 'Geraeusch zur Bestaetigung im Gefangenen-RP um nicht aufzufallen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Begruessung');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Pue', 'pue');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 909, '00000000-0000-0000-0000-000000000000');
END $$;

-- 38. Packlam (15:51 = 951s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'packlam', 'Packlam', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Name den man in Zoom-Meetings grundlos herausschreit.', 'Name den man in Zoom-Meetings grundlos herausschreit.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Meta'), (tid, 'Humor');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Freeman', 'freeman');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 951, '00000000-0000-0000-0000-000000000000');
END $$;

-- 39. Freeman (15:51 = 951s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'freeman', 'Freeman', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Alias fuer Packlam. Ebenfalls ein in Zoom-Meetings gerufener Name.', 'Alias fuer Packlam. Ebenfalls ein in Zoom-Meetings gerufener Name.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Meta'), (tid, 'Humor');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Packlam', 'packlam');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 951, '00000000-0000-0000-0000-000000000000');
END $$;

-- 40. Ejakulat als Mousepad benutzen (16:01 = 961s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'ejakulat-als-mousepad-benutzen', 'Ejakulat als Mousepad benutzen', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Genau das — im Spiel.', 'Genau das — im Spiel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 961, '00000000-0000-0000-0000-000000000000');
END $$;

-- 41. Unterweisen Sie mich (16:14 = 974s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'unterweisen-sie-mich', 'Unterweisen Sie mich', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Versprechen an einen Meister im Star Wars RP, der Staerkste zu werden.', 'Versprechen an einen Meister im Star Wars RP, der Staerkste zu werden.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Star Wars RP'), (tid, 'Lore');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 974, '00000000-0000-0000-0000-000000000000');
END $$;

-- 42. Popo Blanco (16:40 = 1000s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'popo-blanco', 'Popo Blanco', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Jemandem den Hintern so lecken, dass er komplett blank ist.', 'Jemandem den Hintern so lecken, dass er komplett blank ist.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1000, '00000000-0000-0000-0000-000000000000');
END $$;

-- 43. Die Ballers (17:06 = 1026s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'die-ballers', 'Die Ballers', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Leute die Teil der Ballers-Gang/Gruppierung sind.', 'Leute die Teil der Ballers-Gang/Gruppierung sind.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Gangs');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Ballers', 'ballers');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1026, '00000000-0000-0000-0000-000000000000');
END $$;

-- 44. Selber geil (17:15 = 1035s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'selber-geil', 'Selber geil', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn jemand etwas einfach selbst geil findet — und das auch so kommuniziert.', 'Wenn jemand etwas einfach selbst geil findet — und das auch so kommuniziert.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Reaktion'), (tid, 'Slang');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1035, '00000000-0000-0000-0000-000000000000');
END $$;

-- 45. Halsgang (17:37 = 1057s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'halsgang', 'Halsgang', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Ein Doppelkinn.', 'Ein Doppelkinn.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Koerper'), (tid, 'Humor');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1057, '00000000-0000-0000-0000-000000000000');
END $$;

-- 46. Haende in die Hoehe (17:46 = 1066s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'haende-in-die-hoehe', 'Haende in die Hoehe', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'RP-Aufforderung die Haende hochzumachen.', 'RP-Aufforderung die Haende hochzumachen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Cops');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1066, '00000000-0000-0000-0000-000000000000');
END $$;

-- 47. Scheisse sagt man nicht, Scheisse trinkt man (18:01 = 1081s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'scheisse-sagt-man-nicht-scheisse-trinkt-man', 'Scheisse sagt man nicht, Scheisse trinkt man', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Humorvoller Spruch. Selbsterklaerend.', 'Humorvoller Spruch. Selbsterklaerend.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Sprueche'), (tid, 'Klassiker');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1081, '00000000-0000-0000-0000-000000000000');
END $$;

-- 48. Luxurioese Luxusyacht (18:01 = 1081s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'luxurioese-luxusyacht', 'Luxurioese Luxusyacht', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Eine Yacht, die durchaus sehr luxurioes ist. Betonung auf Luxus.', 'Eine Yacht, die durchaus sehr luxurioes ist. Betonung auf Luxus.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Objekte'), (tid, 'Humor');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1081, '00000000-0000-0000-0000-000000000000');
END $$;

-- 49. Spesendeckung (18:20 = 1100s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'spesendeckung', 'Spesendeckung', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn der Chef alle Ausgaben deckt.', 'Wenn der Chef alle Ausgaben deckt.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Meta'), (tid, 'Business');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1100, '00000000-0000-0000-0000-000000000000');
END $$;

-- 50. Rumpschwangern (18:33 = 1113s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'rumpschwangern', 'Rumpschwangern', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn man im RP schwanger herumlaeuft.', 'Wenn man im RP schwanger herumlaeuft.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Humor');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1113, '00000000-0000-0000-0000-000000000000');
END $$;

-- 51. Latte blanchieren (18:46 = 1126s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'latte-blanchieren', 'Latte blanchieren', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Die Latte (Penis) von jemandem zum Ueberkochen bringen.', 'Die Latte (Penis) von jemandem zum Ueberkochen bringen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1126, '00000000-0000-0000-0000-000000000000');
END $$;

-- 52. Plattfuss (19:10 = 1150s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'plattfuss', 'Plattfuss', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Ein orthopaedisch platter Fuss.', 'Ein orthopaedisch platter Fuss.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Koerper'), (tid, 'Humor');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1150, '00000000-0000-0000-0000-000000000000');
END $$;

-- 53. Definitiv (19:29 = 1169s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'definitiv', 'Definitiv', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn etwas einfach sicher und absolut ist.', 'Wenn etwas einfach sicher und absolut ist.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Zustimmung'), (tid, 'Slang');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Finde ich', 'finde-ich');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1169, '00000000-0000-0000-0000-000000000000');
END $$;

-- 54. Sex Cola (20:09 = 1209s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'sex-cola', 'Sex Cola', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Eine sehr kalte, frische Cola. Das Erlebnis ist fast sinnlich.', 'Eine sehr kalte, frische Cola. Das Erlebnis ist fast sinnlich.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Getraenke'), (tid, 'Humor');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1209, '00000000-0000-0000-0000-000000000000');
END $$;

-- 55. Kackdusche (20:30 = 1230s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'kackdusche', 'Kackdusche', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Die Dusche auf einer Luxusyacht. Klingt schlimmer als sie ist.', 'Die Dusche auf einer Luxusyacht. Klingt schlimmer als sie ist.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Objekte'), (tid, 'Humor');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1230, '00000000-0000-0000-0000-000000000000');
END $$;

-- 56. Vergeilt (20:39 = 1239s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'vergeilt', 'Vergeilt', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn etwas ueberdurchschnittlich geil ist. Steigerung von geil.', 'Wenn etwas ueberdurchschnittlich geil ist. Steigerung von geil.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Reaktion'), (tid, 'Slang');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1239, '00000000-0000-0000-0000-000000000000');
END $$;

-- 57. Aufspritzen (20:58 = 1258s)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'aufspritzen', 'Aufspritzen', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Vulgaerer Begriff am Ende des Videos.', 'Vulgaerer Begriff am Ende des Videos.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO clip_term_links (clip_id, term_id, start_seconds, linked_by)
  VALUES ('a0000000-0000-0000-0000-000000000002', tid, 1258, '00000000-0000-0000-0000-000000000000');
END $$;

-- ============================================
-- ADDITIONAL TERMS (no timecodes)
-- ============================================

-- 58. Auf den Schluepper treten
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'auf-den-schluepper-treten', 'Auf den Schluepper treten', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Jemandem zu nahe treten.', 'Jemandem zu nahe treten.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Trolling'), (tid, 'Provokation');
END $$;

-- 59. Beste Kopf
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'beste-kopf', 'Beste Kopf', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn eine Situation einfach das "beste Leben" ist.', 'Wenn eine Situation einfach das "beste Leben" ist.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Reaktion'), (tid, 'Positivitaet');
END $$;

-- 60. Cremescheisse
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'cremescheisse', 'Cremescheisse', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Kot in einem sehr cremigen Zustand.', 'Kot in einem sehr cremigen Zustand.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'Humor');
END $$;

-- 61. Folgendermassen
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'folgendermassen', 'Folgendermassen', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn etwas in einer bestimmten Art und Weise erfolgt. Einleitungsformel.', 'Wenn etwas in einer bestimmten Art und Weise erfolgt. Einleitungsformel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Slang'), (tid, 'Ausdruck');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Folgender Basit', 'folgender-basit');
END $$;

-- 62. Haartattoo
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'haartattoo', 'Haartattoo', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Schmerzfreie Alternative zur Haartransplantation.', 'Schmerzfreie Alternative zur Haartransplantation.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Humor'), (tid, 'Meta');
END $$;

-- 63. Igelbau
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'igelbau', 'Igelbau', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Zustand in dem etwas vollkommen "Firma" ist.', 'Zustand in dem etwas vollkommen "Firma" ist.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Zustand'), (tid, 'Slang');
END $$;

-- 64. Knackig
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'knackig', 'Knackig', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Etwas das knackt und Widerstand bietet.', 'Etwas das knackt und Widerstand bietet.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Beschreibung'), (tid, 'Slang');
END $$;

-- 65. Kniepel
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'kniepel', 'Kniepel', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Alternatives Wort fuer den Penis.', 'Alternatives Wort fuer den Penis.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'Slang');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES
    (tid, 'Schniepel', 'schniepel'),
    (tid, 'Pilo', 'pilo');
END $$;

-- 66. Konzisch
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'konzisch', 'Konzisch', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Jemand der sich als Experte (Connaisseur) auskennt.', 'Jemand der sich als Experte (Connaisseur) auskennt.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Beschreibung'), (tid, 'Ironie');
END $$;

-- 67. Martin
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'martin', 'Martin', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Die reale Persoenlichkeit / der echte Name des YouTubers.', 'Die reale Persoenlichkeit / der echte Name des YouTubers.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Personen'), (tid, 'Meta');
END $$;

-- 68. Muckelig
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'muckelig', 'Muckelig', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Unnormal gemuetlich. Steigerung von gemuetlich.', 'Unnormal gemuetlich. Steigerung von gemuetlich.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Gefuehl'), (tid, 'Slang');
END $$;

-- 69. Orschotz
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'orschotz', 'Orschotz', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Jemanden auf den Allerwertesten erbrechen.', 'Jemanden auf den Allerwertesten erbrechen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'RP');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Schwanzkotz', 'schwanzkotz');
END $$;

-- 70. Pilo
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'pilo', 'Pilo', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Verniedlichungsbegriff fuer Schniepel/Kniepel.', 'Verniedlichungsbegriff fuer Schniepel/Kniepel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Vulgaer'), (tid, 'Verniedlichung');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Kniepel', 'kniepel');
END $$;

-- 71. Pobert
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'pobert', 'Pobert', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Lustiger Ersatz fuer den Namen Robert.', 'Lustiger Ersatz fuer den Namen Robert.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Namen'), (tid, 'Humor');
END $$;

-- 72. Pokomaene
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'pokomaene', 'Pokomaene', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Bezeichnung fuer die Moebelkette Poco als Einzelhandelsdomaene.', 'Bezeichnung fuer die Moebelkette Poco als Einzelhandelsdomaene.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Orte'), (tid, 'Meta');
END $$;

-- 73. Samuel
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'samuel', 'Samuel', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Synonym fuer einen NPC im Spiel.', 'Synonym fuer einen NPC im Spiel.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'GTA RP'), (tid, 'Personen');
END $$;

-- 74. Schwakau / Schwa (additional entry — slang lore version)
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'schwakau-schwa', 'Schwakau / Schwa', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Slangwort das angeblich vom YouTuber in Deutschland populaer gemacht wurde. Auch: Schwanz kauen.', 'Slangwort das angeblich vom YouTuber in Deutschland populaer gemacht wurde. Auch: Schwanz kauen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Slang'), (tid, 'Lore');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'Schwakau', 'schwakau');
END $$;

-- 75. Uncancelbarkeit
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'uncancelbarkeit', 'Uncancelbarkeit', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Der Zustand absolut nicht gecancelt werden zu koennen.', 'Der Zustand absolut nicht gecancelt werden zu koennen.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Meta'), (tid, 'Zustand');
END $$;

-- 76. Von alleine
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'von-alleine', 'Von alleine', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Wenn etwas vollkommen ohne Fremdeinwirkung passiert.', 'Wenn etwas vollkommen ohne Fremdeinwirkung passiert.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Ausdruck'), (tid, 'Meta');
END $$;

-- 77. Was zum Schradin
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'was-zum-schradin', 'Was zum Schradin', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Ausruf der Verwunderung oder des Entsetzens.', 'Ausruf der Verwunderung oder des Entsetzens.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Ausruf'), (tid, 'Reaktion');
END $$;

-- 78. Werder Flakes
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'werder-flakes', 'Werder Flakes', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Humorvolle Abwandlung von "Werner in die Cornflakes".', 'Humorvolle Abwandlung von "Werner in die Cornflakes".', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Humor'), (tid, 'Referenz');
END $$;

-- 79. xxx Loots
DO $$ DECLARE tid UUID; BEGIN
  tid := gen_random_uuid();
  INSERT INTO glossary_terms (id, slug, term, status, created_by, verified_by_gleggmire)
  VALUES (tid, 'xxx-loots', 'xxx Loots', 'approved', '00000000-0000-0000-0000-000000000000', true);
  INSERT INTO term_definitions (term_id, definition, example_sentence, submitted_by)
  VALUES (tid, 'Kontrahent zur Pokomaene. Bezieht sich auf XXXLutz.', 'Kontrahent zur Pokomaene. Bezieht sich auf XXXLutz.', '00000000-0000-0000-0000-000000000000');
  INSERT INTO term_tags (term_id, tag) VALUES (tid, 'Orte'), (tid, 'Meta');
  INSERT INTO term_aliases (term_id, alias, alias_normalized) VALUES (tid, 'XXXLutz', 'xxxlutz');
END $$;
