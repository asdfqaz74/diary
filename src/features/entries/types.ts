export type EntryDetailData =
  | {
      dateLabel: string;
      editHref: string;
      entryDate: string;
      kind: "empty";
      subtitle: string;
    }
  | {
      body: string;
      dateLabel: string;
      editHref: string;
      entryDate: string;
      kind: "entry";
      locationLabel: string;
      moodLabel: string;
      paperClassName: string;
      savedAtLabel: string;
      subtitle: string;
      title: string;
      weatherLabel: string;
    };
