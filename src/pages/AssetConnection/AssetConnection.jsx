import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountData } from '../../hooks/api/userAccount/useAccountData';
import { BiArrowBack } from 'react-icons/bi';
import CardList from './Pages/CardList';
import DefaultButton from '../../components/DefaultButton/DefaultButton';
import './AssetConnection.scss';

const AssetConnection = () => {
  const navigate = useNavigate();

  const [myCards, setMyCards] = useState([]);
  const [myBanks, setMyBanks] = useState([]);
  const [cardClick, setCardClick] = useState(true);
  const [bankClick, setBankClick] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  console.log(selectedCards);
  console.log(selectedBanks);

  const handleItemClick = (type, providerId) => {
    if (type === 'card') {
      setSelectedCards(prev =>
        prev.includes(providerId)
          ? prev.filter(item => item !== providerId)
          : [...prev, providerId],
      );
    } else if (type === 'bank') {
      setSelectedBanks(prev =>
        prev.includes(providerId)
          ? prev.filter(item => item !== providerId)
          : [...prev, providerId],
      );
    }
  };

  const handleSave = () => {
    navigate(
      `/select-asset?b=${selectedBanks.join(',')}&c=${selectedCards.join(',')}`,
    );
  };

  const { data, isError } = useAccountData();
  useEffect(() => {
    if (data) {
      console.log(data);
      setMyBanks(data.bank);
      setMyCards(data.card);
    } else if (isError) {
      console.error('데이터 통신 실패');
    } else {
      console.log('통신 실패');
    }
  }, [data, isError]);

  const handleCardClick = () => {
    setCardClick(true);
    setBankClick(false);
  };
  const handlebankClick = () => {
    setCardClick(false);
    setBankClick(true);
  };

  return (
    <div className="assetConnection">
      <header>
        <BiArrowBack
          className="toBack"
          onClick={() => {
            navigate(-1);
          }}
        />
      </header>

      <main className="">
        <section className="announcementMessage">
          <h5>연결할 기관을</h5>
          <h5>
            <span className="highlight">카테고리별로 선택</span>해주세요
          </h5>
        </section>

        <section className="categories">
          <button
            className={`categoryButton ${cardClick ? 'bold' : ''}`}
            onClick={handleCardClick}
          >
            카드
          </button>
          <button
            className={`categoryButton ${bankClick ? 'bold' : ''}`}
            onClick={handlebankClick}
          >
            은행
          </button>
        </section>

        {cardClick && (
          <CardList
            data={myCards}
            type="card"
            onItemSelect={handleItemClick}
            selectedItems={selectedCards}
          />
        )}
        {bankClick && (
          <CardList
            data={myBanks}
            type="bank"
            onItemSelect={handleItemClick}
            selectedItems={selectedBanks}
          />
        )}

        <DefaultButton text="저장" onClick={handleSave} />
      </main>
    </div>
  );
};

export default AssetConnection;
