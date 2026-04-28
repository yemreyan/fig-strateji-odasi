import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrategyApp } from "./StrategyApp";

describe("StrategyApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the Turkish operations room headline and evidence modules", () => {
    render(<StrategyApp />);

    expect(
      screen.getByRole("heading", { name: /fig seçim strateji odası/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/164 federasyonluk harita/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /karar verici mimarisi/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /temas günlüğü/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yakınlaştır/i })).toBeInTheDocument();
  });

  it("filters country queue by Turkish search input", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    const searchInput = screen.getByPlaceholderText(
      /ülke, başkan veya federasyon ara/i
    );
    await user.type(searchInput, "Turkiye");

    expect(screen.getByRole("button", { name: /turkiye tur/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /japan jpn/i })
    ).not.toBeInTheDocument();
  });

  it("allows adding operation notes for the selected country", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.type(screen.getByLabelText(/not başlığı/i), "Karar verici takibi");
    await user.type(
      screen.getByLabelText(/not detayı/i),
      "Başkan ile ikinci temas Mayıs ayının ilk haftasında yapılmalı."
    );
    await user.click(screen.getByRole("button", { name: /not ekle/i }));

    expect(screen.getByText(/karar verici takibi/i)).toBeInTheDocument();
    expect(
      screen.getByText(/başkan ile ikinci temas mayıs ayının ilk haftasında yapılmalı/i)
    ).toBeInTheDocument();
  });

  it("switches between simplified dossier panels", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /spor ve başarı/i }));

    expect(
      screen.getByRole("heading", { name: /spor ve başarı görünümü/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /organizasyon ve tesis izi/i })
    ).toBeInTheDocument();
  });

  it("opens and closes the mobile control sheet", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /mobil kontrol merkezi/i }));

    expect(
      screen.getByRole("heading", { name: /mobil kontrol merkezi/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /çekmeceyi kapat/i }));

    expect(
      screen.queryByRole("heading", { name: /mobil kontrol merkezi/i })
    ).not.toBeInTheDocument();
  });

  it("switches country from the mobile quick card sheet", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /ülke kartları/i }));
    await user.click(screen.getByRole("button", { name: /japan hızlı kartı/i }));

    expect(screen.getAllByRole("heading", { name: /japan jpn/i }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getByText(/doğrulandı: mevcut fig başkanı japonya'dan/i)
    ).toBeInTheDocument();
  });

  it("shows the FIG affiliate directory with phone and email columns", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /fig rehberi/i }));

    expect(
      screen.getByRole("heading", { name: /fig federasyon rehberi/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /telefon/i })).toBeInTheDocument();
    expect(screen.getByText(/\+93\.77\.7779901/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /af\.gymnastic\.federation@gmail\.com/i })
    ).toBeInTheDocument();
  });

  it("filters the directory by missing website records", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /fig rehberi/i }));
    await user.click(screen.getByRole("button", { name: /web sitesi eksik/i }));

    expect(
      screen.getByRole("button", { name: /afg rehber kaydı/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /alb rehber kaydı/i })
    ).not.toBeInTheDocument();
  });

  it("filters the directory by official event footprint", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /fig rehberi/i }));
    await user.click(screen.getByRole("button", { name: /resmî organizasyon izi/i }));

    expect(
      screen.getByRole("button", { name: /ger rehber kaydı/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /afg rehber kaydı/i })
    ).not.toBeInTheDocument();
  });

  it("opens the selected country dossier from the directory view", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /fig rehberi/i }));
    await user.click(screen.getByRole("button", { name: /ülke dosyasını aç/i }));

    expect(screen.getAllByRole("heading", { name: /germany ger/i }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getByRole("heading", { name: /karar verici mimarisi/i })
    ).toBeInTheDocument();
  });

  it("shows the official FIG event footprint in the sports dossier", async () => {
    const user = userEvent.setup();

    render(<StrategyApp />);

    await user.click(screen.getByRole("button", { name: /spor ve başarı/i }));

    expect(
      screen.getByRole("heading", { name: /resmî fig organizasyon izi/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/fig apparatus world cup/i)).toBeInTheDocument();
  });
});
